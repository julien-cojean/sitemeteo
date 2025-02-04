"use client";
import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa6";
import Link from "next/link";
import { Modal } from "antd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RxCross2 } from "react-icons/rx";

export default function Nav() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [signUpUsername, setSignUpUsername] = useState<string>("");
  const [signUpEmail, setsignUpEmail] = useState<string>("");
  const [signUpPassword, setSignUpPassword] = useState<string>("");
  const [signInEmail, setSignInEmail] = useState<string>("");
  const [signInPassword, setSignInPassword] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const showModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const closeModal = () => {
    setIsModalVisible(false);
  };
  const deconnecter = () => {
    setUser("");
    setMessage("Vous êtes déconnecté");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpUsername,
          email: signUpEmail,
          password: signUpPassword,
        }),
      });
      setSignUpUsername("");
      setSignUpPassword("");
      setIsModalVisible(false);

      const register = await response.json();
      if (response.status === 201) {
        console.log("voici la creation du compte", register);
        setUser(register.newUser.name);
        setMessage("Félicitation, votre compte est créé.");
        setTimeout(() => setMessage(""), 2000);
        setMessage("");
      } else if (response.status === 500) {
        setMessage("Erreur lors de la création de votre compte");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (error) {
      setMessage("Erreur lors de la communication avec le serveur.");
      setTimeout(() => setMessage(""), 3000);
      console.error("Erreur lors de la communication avec le serveur", error);
    }
  };

  const seConnecter = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
        }),
      });
      setSignInEmail("");
      setSignInPassword("");
      setIsModalVisible(false);

      const data = await response.json();
      if (response.status === 201) {
        console.log("voici l'utilisateur connecté", data);
        setMessage("Félicitation connexion réussie");
        console.log("test", message);
        setTimeout(() => setMessage(""), 2000);
        setUser(data.user.name);
      } else if (response.status === 400) {
        setMessage("utilisateur introuvable");
        setTimeout(() => setMessage(""), 2000);
      } else if (response.status === 401) {
        setMessage("mot de passe incorrect");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (error) {
      console.error("erreur lors de la communication avec le serveur", error);
    }
  };

  let modalContent: React.ReactNode = null; // initialisation de modalContent
  if (!user) {
    modalContent = (
      <div className="flex justify-center items-center bg-gray-100 p-6">
        {/* Modal content */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl space-y-6">
          {/*section créer un compte*/}
          <div className="flex flex-col space-y-4 bg-emerald-200 p-6 rounded-lg shadow-md">
            <p className="text-xl font-semibold text-center text-gray-800">
              Créer un compte
            </p>
            <Input
              type="text"
              placeholder="Username"
              id="signUpUsername"
              onChange={(e) => setSignUpUsername(e.target.value)}
              value={signUpUsername}
            />
            <Input
              type="email"
              placeholder="Email"
              id="signUpEmail"
              onChange={(e) => setsignUpEmail(e.target.value)}
              value={signUpEmail}
            />
            <Input
              type="password"
              placeholder="Password"
              id="signUpPassword"
              onChange={(e) => setSignUpPassword(e.target.value)}
              value={signUpPassword}
            />
            <Button id="register" onClick={() => handleRegister()}>
              Créer
            </Button>
          </div>
          {/* Separation section */}
          <div className="border-t border-gray-300 my-6"></div>

          <div className="flex flex-col space-y-4 bg-blue-200 p-6 rounded-lg shadow-md">
            {/*section se connecter*/}
            <p className="text-xl font-semibold text-center text-gray-800">
              Se connecter
            </p>
            <Input
              type="email"
              placeholder="Email"
              id="signInEmail"
              onChange={(e) => setSignInEmail(e.target.value)}
              value={signInEmail}
            />
            <Input
              type="password"
              placeholder="Password"
              id="signInPassword"
              onChange={(e) => setSignInPassword(e.target.value)}
              value={signInPassword}
            />
            <Button id="register" onClick={() => seConnecter()}>
              Connexion
            </Button>
          </div>
        </div>
        <button
          className="absolute  top-2 right-2 p-2 justify-center items-center rounded-full bg-gray-200"
          onClick={() => closeModal()}
        >
          {" "}
          <RxCross2 />
        </button>
      </div>
    );
  }

  let userSection: React.ReactNode = null;
  if (user) {
    userSection = (
      <div className="flex flex-col">
        <Button
          className="bg-white text-black hover:bg-blue-300"
          onClick={() => deconnecter()}
        >
          Se deconnecter
        </Button>
        <h3 className="flex mb-4"> Bienvenue {user}</h3>
      </div>
    );
  } else {
    userSection = (
      <Link href="">
        <FaRegUser onClick={() => showModal()} />
      </Link>
    );
  }

  return (
    <nav className="w-full h-20 flex justify-between bg-blue-950 text-white p-4 gap-4">
      <div></div>
      <h1 className="font-bold">Météo app</h1>
      {userSection}
      {message && (
        <div
          className={`fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-lg z-50 ${
            message.includes("Félicitation")
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <p className="text-sm font-semibold">{message}</p>
        </div>
      )}
      {isModalVisible && (
        <div id="react-modals">
          <Modal open={isModalVisible} closable={false} footer={null}>
            {modalContent}
          </Modal>
        </div>
      )}
    </nav>
  );
}
