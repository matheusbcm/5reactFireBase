import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAtuXELvpS1dkOknOdgV8ndH5irJ_Jg_xE",
  authDomain: "projeto-filmes-tmdb.firebaseapp.com",
  projectId: "projeto-filmes-tmdb",
});

interface User {
  id: string;
  title: string;
  overview: string;
  description: string;
  year: string;
  genre: string;
  imgUrl: string;
}

export const App = () => {
  const [id, setId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [overview, setOverview] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  const db = getFirestore(firebaseApp);
  const usersCollectionRef = collection(db, "user");

  const criarDado = async () => {
    try {
      const user = await addDoc(usersCollectionRef, {
        id,
        title,
        overview,
        description,
        year,
        genre,
        imgUrl,
      });

      console.log("Dados salvos com sucesso", user);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as User)));
    };
    getUsers();
  }, []);

  const deleteUser = async (id: string) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);

    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div>
      <input
        type="id"
        placeholder="id"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Título do filme"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="URL da imagem"
        value={imgUrl}
        onChange={(e) => setImgUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Resumo do filme"
        value={overview}
        onChange={(e) => setOverview(e.target.value)}
      />
      <button onClick={criarDado}>Inserir Filme</button>

      <ul>
        {users.map((user) => (
          <div key={user.id}>
            <img src={user.imgUrl} alt={user.title} />
            <p>Title: {user.title}</p>
            <p>Overview: {user.overview}</p>
            <button onClick={() => deleteUser(user.id)}>Deletar</button>
          </div>
        ))}
      </ul>
    </div>
  );
};
