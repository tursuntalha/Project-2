const { ChromaClient } = require('chromadb');

const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';
const COLLECTION_NAME = 'shopmind_products';

const client = new ChromaClient({ path: CHROMA_URL });

async function getCollection() {
  const existing = await client.listCollections();
  if (existing.includes(COLLECTION_NAME)) {
    return await client.getCollection({ name: COLLECTION_NAME });
  }
  return await client.createCollection({ name: COLLECTION_NAME });
}

async function getEmbedding(text) {
  const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
  const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'nomic-embed-text', prompt: text }),
  });
  const data = await res.json();
  return data.embedding;
}

async function indexProduct(product) {
  try {
    const text = `${product.name} ${product.description} ${JSON.stringify(product.specs)} ${product.category}`;
    const embedding = await getEmbedding(text);
    const collection = await getCollection();
    await collection.upsert({
      ids: [product._id.toString()],
      embeddings: [embedding],
      metadatas: [{ product_id: product._id.toString(), name: product.name, category: product.category, price: product.price }],
    });
    await product.constructor.findByIdAndUpdate(product._id, { embedding });
  } catch (err) {
    console.error('Error indexing product:', err.message);
  }
}

async function removeProduct(productId) {
  try {
    const collection = await getCollection();
    await collection.delete({ ids: [productId] });
  } catch (err) {
    console.error('Error removing product:', err.message);
  }
}

async function searchSimilar(query, nResults = 10) {
  try {
    const embedding = await getEmbedding(query);
    const collection = await getCollection();
    const results = await collection.query({ queryEmbeddings: [embedding], nResults });
    return results;
  } catch (err) {
    console.error('Error searching:', err.message);
    return { ids: [[]], distances: [[]], metadatas: [[]] };
  }
}

module.exports = { indexProduct, removeProduct, searchSimilar };
