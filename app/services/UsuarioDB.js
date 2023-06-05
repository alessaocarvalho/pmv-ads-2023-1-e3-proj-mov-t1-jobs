import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydatabase.db');

export const criarTabelaUsuarios = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT, cpf TEXT, telefone TEXT, senha TEXT)',
        [],
        () => {
          console.log('Tabela usuarios criada com sucesso');
        },
        (error) => {
          console.error('Erro ao criar tabela usuarios: ', error);
        }
      );
    });
  };

  export const salvarUsuario = (usuarioCriado, callback) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        console.log('Iniciando transação');
        tx.executeSql(
          'INSERT INTO usuarios (nome, email, cpf, telefone, senha) VALUES (?, ?, ?, ?, ?)',
          [usuarioCriado.nome, usuarioCriado.email, usuarioCriado.cpf, usuarioCriado.telefone, usuarioCriado.senha],
          (_, { rowsAffected, insertId }) => {
            console.log('')
            if (rowsAffected > 0) {
              console.log('Usuário cadastrado com sucesso. ID: ', insertId);
              resolve();
            } else {
              console.error('Falha ao cadastrar o usuário');
              reject(new Error('Falha ao cadastrar o usuário'));
            }
          },
          (error) => {
            console.error('Erro ao inserir o usuário no banco de dados: ', error);
            reject(error);
          }
        );
      }, (transactionError) => {
        console.error('Erro durante a transação: ', transactionError);
        reject(transactionError);
      }, () => {
        console.log('Transação concluída');
        if (callback) {
          callback(); // Chama o callback passado como parâmetro
        }
        resolve(); // Resolve a promise quando a transação é concluída
      });
    });
  };
  
  export const getCadastroUsuarios = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM usuarios',
          [],
          (_, { rows }) => {
            resolve(rows._array);
          },
          (_, error) => {
            reject(error);
          }
        );
      }, (transactionError) => {
        console.error('Erro durante a transação: ', transactionError);
        reject(transactionError);
      }, () => {
        console.log('Transação concluída');
      });
    });
  };
