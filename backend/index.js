const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;

app.post('/api/pedidos', (req, res) => {
  const { cliente, mesa, productos, total } = req.body;
  
  console.log('\n====================================');
  console.log('🔥 NUEVO PEDIDO RECIBIDO! 🔥');
  console.log(`👤 Cliente: ${cliente || 'Anónimo'}`);
  console.log(`📍 Mesa: ${mesa}`);
  console.log('📦 Productos:');
  if (Array.isArray(productos)) {
    productos.forEach(p => {
      console.log(`   - ${p.cantidad}x ${p.nombre} (Unitario: $${p.precioUnitario})`);
    });
  }
  console.log(`💰 Total: $${total}`);
  console.log('====================================\n');

  res.status(200).json({ ok: true, mensaje: '¡Pedido recibido en cocina! 🔥' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de la cocina corriendo en http://localhost:${PORT}`);
});