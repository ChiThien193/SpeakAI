from typing import List, Dict, Optional
import os

class RAGService:
    def __init__(self):
        # Không dùng chromadb, dùng dictionary đơn giản
        self.collections = {}
        self._init_default_data()
    
    def _init_default_data(self):
        """Initialize with default data"""
        self.collections["restaurant"] = [
            "The restaurant is open from 9 AM to 10 PM daily. We serve breakfast, lunch, and dinner.",
            "Our menu includes pizza, pasta, burgers, and salads. Vegetarian options are available.",
            "To place an order, please tell me what you'd like. You can say: I'd like a pizza please.",
            "For reservations, please provide your name, number of guests, and preferred time.",
            "We accept credit cards, cash, and mobile payments.",
            "The restaurant has free WiFi and air conditioning.",
            "Our signature dishes include Margherita pizza and Carbonara pasta."
        ]
    
    def add_documents(self, collection_name: str, documents: List[str], metadatas: List[Dict] = None):
        """Add documents to collection"""
        if collection_name not in self.collections:
            self.collections[collection_name] = []
        self.collections[collection_name].extend(documents)
        print(f"Added {len(documents)} documents to '{collection_name}'")
        return [str(i) for i in range(len(documents))]
    
    def search(self, collection_name: str, query: str, n_results: int = 3) -> List[str]:
        """Simple keyword-based search"""
        if collection_name not in self.collections:
            return []
        
        # Simple keyword matching
        query_words = set(query.lower().split())
        results = []
        
        for doc in self.collections[collection_name]:
            doc_lower = doc.lower()
            # Count matching words
            score = sum(1 for word in query_words if word in doc_lower)
            if score > 0:
                results.append((doc, score))
        
        # Sort by score and return top n_results
        results.sort(key=lambda x: x[1], reverse=True)
        return [doc for doc, _ in results[:n_results]]
    
    def delete_collection(self, name: str):
        """Delete a collection"""
        if name in self.collections:
            del self.collections[name]
            print(f"Deleted collection '{name}'")
    
    def list_collections(self) -> List[str]:
        """List all collections"""
        return list(self.collections.keys())

rag_service = RAGService()