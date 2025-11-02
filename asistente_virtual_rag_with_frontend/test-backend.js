// Script de prueba para verificar el backend
import fetch from 'node-fetch';

const testBackend = async () => {
  try {
    console.log('🧪 Probando backend...');
    
    const response = await fetch('http://localhost:3000/api/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Hola, ¿funciona el backend?' })
    });
    
    console.log('📊 Status:', response.status);
    console.log('📊 Headers:', response.headers.raw());
    
    const data = await response.json();
    console.log('📊 Response:', data);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testBackend();
