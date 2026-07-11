'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  descripcion: string;
}

function MenuContenido() {
  const searchParams = useSearchParams();
  const [mesa, setMesa] = useState<string>('7');
  const [nombreCliente, setNombreCliente] = useState<string>('');
  const [carrito, setCarrito] = useState<{ [key: number]: number }>({});
  const [enviando, setEnviando] = useState<boolean>(false);
  const [mensajeStatus, setMensajeStatus] = useState<string>('');

  const productos: Producto[] = [
    { id: 1, nombre: "OJO DE BIFE 'GUARDIA VIEJA'", precio: 18500, categoria: 'Parrilla', descripcion: '400g de puro sabor, madurado 21 días, a la leña de quebracho.' },
    { id: 2, nombre: 'VACÍO DEL FINO', precio: 16200, categoria: 'Parrilla', descripcion: 'Corte tierno con costra de sal parrillera.' },
    { id: 3, nombre: 'CHORIPÁN CASERO', precio: 3500, categoria: 'Entradas', descripcion: 'Chorizo puro cerdo con chimichurri de la casa.' },
    { id: 4, nombre: 'PAPAS FRITAS MEDIANAS', precio: 3000, categoria: 'Guarniciones', descripcion: 'Papas crocantes bastón fritas en el momento.' }
  ];

  useEffect(() => {
    const mesaURL = searchParams.get('mesa');
    if (mesaURL) {
      setMesa(mesaURL);
    }
  }, [searchParams]);

  const agregarAlCarrito = (id: number) => {
    setCarrito(prev => {
      const actual = { ...prev };
      actual[id] = (actual[id] || 0) + 1;
      return actual;
    });
  };

  const quitarDelCarrito = (id: number) => {
    setCarrito(prev => {
      const actual = { ...prev };
      if (actual[id] > 1) {
        actual[id]--;
      } else {
        delete actual[id];
      }
      return actual;
    });
  };

  const calcularTotal = () => {
    return Object.entries(carrito).reduce((total, [id, cantidad]) => {
      const prod = productos.find(p => p.id === parseInt(id));
      return total + (prod ? prod.precio * cantidad : 0);
    }, 0);
  };

  const enviarPedido = async () => {
    if (!nombreCliente.trim()) {
      alert('Por favor, ingresá tu nombre antes de pedir.');
      return;
    }
    if (Object.keys(carrito).length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    setEnviando(true);
    try {
      const response = await fetch('http://localhost:4000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: nombreCliente,
          mesa: mesa,
          productos: Object.entries(carrito).map(([id, cantidad]) => {
            const p = productos.find(prod => prod.id === parseInt(id));
            return { nombre: p?.nombre, cantidad, precioUnitario: p?.precio };
          }),
          total: calcularTotal()
        })
      });

      const data = await response.json();
      if (data.ok) {
        setMensajeStatus('🎉 ¡Marchando a la parrilla!');
        setCarrito({});
      } else {
        setMensajeStatus('❌ Error al enviar.');
      }
    } catch {
      setMensajeStatus('❌ Sin conexión.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main style={{ backgroundColor: '#141517', color: '#f5f5f5', minHeight: '100vh', padding: '10px', fontFamily: '"Courier New", Courier, monospace', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ width: '100%', maxWidth: '600px', backgroundColor: '#1a1b1e', padding: '20px 15px', borderRadius: '12px', border: '10px solid #5c4033', boxShadow: '0px 10px 30px rgba(0,0,0,0.5)', boxSizing: 'border-box' }}>
        <header style={{ textAlign: 'center', borderBottom: '2px dashed #444', paddingBottom: '20px', marginBottom: '25px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-5px', backgroundColor: '#c1121f', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem', border: '1px solid #fff' }}>
            MESA N° {mesa}
          </div>
          <h1 style={{ color: '#ffb703', margin: '15px 0 0 0', fontSize: '2rem', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>
            GUARDIA VIEJA
          </h1>
          <p style={{ color: '#aaa', margin: '5px 0 0 0', fontSize: '0.95rem', letterSpacing: '2px' }}>PARRILLA & BODEGÓN</p>
        </header>

        <section style={{ marginBottom: '35px', textAlign: 'center' }}>
          <label style={{ display: 'block', marginBottom: '12px', color: '#ffb703', fontSize: '0.95rem', fontWeight: 'bold' }}>✍️ ¿A NOMBRE DE QUIÉN SALE EL PEDIDO?</label>
          <input 
            type="text" 
            placeholder="Escribí tu nombre aquí..." 
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            style={{ padding: '14px', width: '100%', borderRadius: '4px', border: '2px solid #555', backgroundColor: '#141517', color: '#ffb703', textAlign: 'center', fontSize: '1.05rem', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box' }}
          />
        </section>

        <section style={{ marginBottom: '120px' }}>
          <h2 style={{ color: '#fff', borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px', fontSize: '1.1rem', fontWeight: 'bold' }}>📋 HOY SE RECOMIENDA:</h2>
          
          {productos.map(p => (
            <div key={p.id} style={{ padding: '15px 0', borderBottom: '1px dashed #333', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, paddingRight: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffb703', fontWeight: 'bold', marginRight: '10px' }}>{p.nombre}</h3>
                  <span style={{ color: '#ffb703', fontWeight: 'bold', fontSize: '1.05rem', whiteSpace: 'nowrap' }}>${p.precio.toLocaleString('es-AR')}</span>
                </div>
                <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem', lineHeight: '1.4' }}>{p.descripcion}</p>
              </div>
              
              <div style={{ minWidth: '95px', display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                {carrito[p.id] ? (
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#c1121f', borderRadius: '4px', border: '1px solid #fff' }}>
                    <button onClick={() => quitarDelCarrito(p.id)} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', padding: '10px 14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', touchAction: 'manipulation' }}>-</button>
                    <span style={{ fontWeight: 'bold', padding: '0 2px', minWidth: '18px', textAlign: 'center', color: '#fff', fontSize: '1rem' }}>{carrito[p.id]}</span>
                    <button onClick={() => agregarAlCarrito(p.id)} style={{ backgroundColor: 'transparent', color: '#fff', border: 'none', padding: '10px 14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', touchAction: 'manipulation' }}>+</button>
                  </div>
                ) : (
                  <button onClick={() => agregarAlCarrito(p.id)} style={{ backgroundColor: 'transparent', color: '#aaa', border: '1px solid #555', padding: '10px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap', touchAction: 'manipulation', display: 'block' }}>
                    + PEDIR
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>

      <footer style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '600px', backgroundColor: '#141517', padding: '15px 20px', borderTop: '4px solid #5c4033', boxSizing: 'border-box', textAlign: 'center', zIndex: 999, boxShadow: '0 -5px 15px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#aaa' }}>TOTAL CONSUMIDO:</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#ffb703' }}>${calcularTotal().toLocaleString('es-AR')}</span>
        </div>
        {Object.keys(carrito).length > 0 && (
          <button onClick={enviarPedido} disabled={enviando} style={{ backgroundColor: '#c1121f', color: '#fff', border: '1px solid #fff', padding: '12px 0', borderRadius: '4px', fontSize: '1.05rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', letterSpacing: '1px', touchAction: 'manipulation' }}>
            {enviando ? 'MARCHANDO...' : '🔥 ENVIAR COMANDA A LA COCINA'}
          </button>
        )}
      </footer>

      {mensajeStatus && (
        <div style={{ position: 'fixed', top: '25px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1a1b1e', color: '#fff', padding: '15px 30px', borderRadius: '4px', border: '2px solid #ffb703', zIndex: 1000, fontWeight: 'bold' }}>
          {mensajeStatus}
        </div>
      )}
    </main>
  );
}

export default function MenuQR() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: '#141517', minHeight: '100vh' }}></div>}>
      <MenuContenido />
    </Suspense>
  );
}