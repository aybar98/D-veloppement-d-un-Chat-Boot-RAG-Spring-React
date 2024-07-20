import {Button, TextField} from "@vaadin/react-components";
import {useEffect, useState} from "react";
import {ChatAiService} from "Frontend/generated/endpoints";
import Markdown from "react-markdown";

export default function Chat() {
    // État pour la question de l'utilisateur
    const [question, setQuestion] = useState<string>("");

    // État pour la réponse du chatbot
    const [response, setResponse] = useState<string>("");

    // État pour indiquer si une réponse est en cours de chargement
    const [loading, setLoading] = useState<boolean>(false);

    // État pour afficher les messages d'erreur
    const [error, setError] = useState<string>("");

    // État pour stocker l'historique des conversations
    const [chatHistory, setChatHistory] = useState<Array<{ question: string, answer: string }>>([]);

    // Chargement de l'historique des conversations depuis le stockage local lors du premier rendu
    useEffect(() => {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            setChatHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Sauvegarde de l'historique des conversations dans le stockage local chaque fois qu'il change
    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }, [chatHistory]);

    // Fonction pour envoyer la question au service de chatbot
    async function send() {
        // Ne pas envoyer la question si elle est vide ou ne contient que des espaces
        if (!question.trim()) return;

        // Début de l'état de chargement
        setLoading(true);
        setError(""); // Réinitialisation de l'erreur

        try {
            // Appel au service de chatbot pour obtenir la réponse
            const resp = await ChatAiService.ragChat(question);
            setResponse(resp); // Mise à jour de la réponse
            // Mise à jour de l'historique des conversations
            setChatHistory([...chatHistory, { question, answer: resp }]);
            setQuestion(""); // Réinitialisation de la question
        } catch (err) {
            // Gestion des erreurs
            setError("An error occurred while fetching the response.");
        } finally {
            // Fin de l'état de chargement
            setLoading(false);
        }
    }

    // Fonction pour effacer l'historique des conversations
    function clearChat() {
        setChatHistory([]); // Réinitialisation de l'historique
        localStorage.removeItem('chatHistory'); // Suppression de l'historique du stockage local
    }

    // Fonction pour exporter l'historique des conversations sous forme de fichier texte
    function exportChatHistory() {
        // Formatage de l'historique des conversations en texte
        const chatContent = chatHistory.map(chat => `Q: ${chat.question}\nA: ${chat.answer}`).join('\n\n');
        const blob = new Blob([chatContent], { type: 'text/plain' }); // Création d'un objet Blob pour le contenu du fichier
        const url = URL.createObjectURL(blob); // Création d'un URL pour le Blob
        const link = document.createElement('a'); // Création d'un élément <a> pour le téléchargement
        link.href = url; // Attribution de l'URL au lien
        link.download = 'chat_history.txt'; // Nom du fichier de téléchargement
        document.body.appendChild(link); // Ajout du lien au corps du document
        link.click(); // Simulation du clic pour démarrer le téléchargement
        document.body.removeChild(link); // Suppression du lien du corps du document
    }

    return (
        <div className="p-m">
            <h3>Chat Bot</h3>
            <div>
                {/* Champ de texte pour la question */}
                <TextField
                    style={{ width: '80%' }}
                    value={question}
                    onChange={e => setQuestion(e.target.value)} // Mise à jour de la question lors de la saisie
                    disabled={loading} // Désactivation pendant le chargement
                />
                {/* Bouton pour envoyer la question */}
                <Button theme="primary" onClick={send} disabled={loading}>
                    {loading ? "Loading..." : "Send"} {/* Texte du bouton basé sur l'état de chargement */}
                </Button>
                {/* Bouton pour effacer l'historique des conversations */}
                <Button theme="secondary" onClick={clearChat}>
                    Clear Chat
                </Button>
                {/* Bouton pour exporter l'historique des conversations */}
                <Button theme="secondary" onClick={exportChatHistory}>
                    Export Chat History
                </Button>
                {/* Affichage des messages d'erreur */}
                {error && <div style={{ color: "red" }}>{error}</div>}
                <div>
                    {/* Affichage de l'historique des conversations */}
                    {chatHistory.map((chat, index) => (
                        <div key={index}>
                            <strong>Q: {chat.question}</strong>
                            <Markdown>{chat.answer}</Markdown> {/* Affichage de la réponse en Markdown */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}