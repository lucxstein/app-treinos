'use client';

import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [treinos, setTreinos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  // Função para verificar a autenticação do usuário
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/'); // Redireciona para a página inicial (login) se não autenticado
        return;
      }

      setUser(user); // Armazena os dados do usuário autenticado
      loadTreinos(user.id); // Carrega os treinos associados ao usuário
    };
    checkUser();
  }, [router]);

  // Função para carregar os treinos do usuário
  const loadTreinos = async (userId) => {
    const { data, error } = await supabase
      .from('Treino')
      .select('*')
      .eq('user_id', userId)
      .order('criado_em', { ascending: false }); // Ordena por data de criação

    if (error) {
      console.error('Erro ao carregar treinos:', error.message);
    } else {
      setTreinos(data); // Atualiza o estado com os treinos carregados
    }
  };

  // Função para adicionar um novo treino
  const adicionarTreino = async () => {
    if (!titulo || !descricao) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    const { data, error } = await supabase
      .from('Treino')
      .insert([{ titulo, descricao, user_id: user.id }]);

    if (error) {
      console.error('Erro ao adicionar treino:', error.message);
    } else {
      setTreinos([data[0], ...treinos]); // Adiciona o novo treino no estado
      setTitulo(''); // Reseta o campo título
      setDescricao(''); // Reseta o campo descrição
    }
  };

  // Função para remover um treino
  const removerTreino = async (id) => {
    const { error } = await supabase.from('Treino').delete().eq('id', id);

    if (error) {
      console.error('Erro ao remover treino:', error.message);
    } else {
      setTreinos(treinos.filter((treino) => treino.id !== id)); // Remove o treino do estado
    }
  };

  if (!user) {
    return <p>Carregando...</p>;
  }

  return (
    <div style={styles.container}>
      {/* Cabeçalho */}
      <header style={styles.header}>
        <h1 style={styles.title}>Bem-vindo, {user.user_metadata.full_name || user.email}</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut(); // Faz logout
            router.push('/'); // Redireciona para o login
          }}
          style={styles.logoutButton}
        >
          Sair
        </button>
      </header>

      {/* Formulário para adicionar treinos */}
      <div style={styles.formContainer}>
        <h2 style={styles.cardTitle}>Adicionar Novo Treino</h2>
        <input
          type="text"
          placeholder="Título do Treino"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Descrição do Treino"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          style={styles.textarea}
        ></textarea>
        <button onClick={adicionarTreino} style={styles.addButton}>
          Adicionar
        </button>
      </div>

      {/* Lista de treinos */}
      <div style={styles.listContainer}>
        {treinos.length > 0 ? (
          treinos.map((treino) => (
            <div key={treino.id} style={styles.listItem}>
              <h3 style={styles.listItemTitle}>{treino.titulo}</h3>
              <p style={styles.listItemDescription}>{treino.descricao}</p>
              <span style={styles.date}>
                Adicionado em: {new Date(treino.criado_em).toLocaleDateString()}
              </span>
              <button
                onClick={() => removerTreino(treino.id)}
                style={styles.deleteButton}
              >
                Remover
              </button>
            </div>
          ))
        ) : (
          <p style={styles.noTreinos}>Nenhum treino encontrado.</p>
        )}
      </div>
    </div>
  );
}

// Estilos
const styles = {
  container: {
    backgroundColor: '#121212', // Fundo preto
    minHeight: '100vh',
    padding: '20px',
    fontFamily: "'Roboto', sans-serif",
    color: '#FFFFFF',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2rem',
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    color: '#FFFFFF',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  formContainer: {
    maxWidth: '600px',
    margin: '0 auto 40px',
    backgroundColor: '#1E1E1E',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    color: '#FFFFFF',
    marginBottom: '15px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #333',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: '#121212',
    color: '#FFFFFF',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #333',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: '#121212',
    color: '#FFFFFF',
    minHeight: '80px',
    outline: 'none',
  },
  addButton: {
    width: '100%',
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  listContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    justifyContent: 'center',
  },
  listItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
  },
  listItemTitle: {
    fontSize: '1.2rem',
    color: '#FFFFFF',
    margin: '0 0 5px',
  },
  listItemDescription: {
    fontSize: '1rem',
    color: '#BBBBBB',
  },
  date: {
    fontSize: '0.9rem',
    color: '#BBBBBB',
    marginTop: '10px',
  },
  deleteButton: {
    marginTop: '10px',
    backgroundColor: '#DC3545',
    color: '#FFFFFF',
    padding: '8px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  noTreinos: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#BBBBBB',
  },
};
