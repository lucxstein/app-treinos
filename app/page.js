'use client';

import { supabase } from './lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Se autenticado, redireciona para a página principal
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://app-treinos-lucxsteins.vercel.app/dashboard',
      },
    });
    if (error) {
      console.error('Erro ao fazer login:', error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Bem-vindo ao App de Treinos</h1>
      <button onClick={handleGoogleLogin} style={styles.button}>
        Login com Google
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#121212',
    color: '#fff',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#4285F4',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
