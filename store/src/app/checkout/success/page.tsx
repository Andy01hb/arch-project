import Link from 'next/link';

export default function SuccessPage() {
    return (
        <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#4ade80' }}>¡Pago Exitoso!</h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '2rem' }}>
                Gracias por tu compra. Hemos enviado un correo con los enlaces de descarga.
            </p>
            <Link href="/" className="btn btn-primary">
                Volver al Inicio
            </Link>
        </div>
    );
}
