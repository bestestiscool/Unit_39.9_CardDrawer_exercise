import React, { useState, useEffect } from "react";
import axios from "axios";

const DrawCard = () => {
  const [deck, setDeck] = useState(null); // Holds the deck data including deck_id, cards, and remaining count
  const [error, setError] = useState(null); // Holds any error messages
  const [isShuffling, setIsShuffling] = useState(false); // Tracks whether the deck is being shuffled

  useEffect(() => {
    // Fetch a new deck and shuffle it when the component mounts
    async function fetchDeck() {
      try {
        const response = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
        setDeck({ deck_id: response.data.deck_id, cards: [], remaining: response.data.remaining });
      } catch (err) {
        setError('Error fetching deck data');
      }
    }
    fetchDeck();
  }, []);

  const drawCard = async () => {
    // Check if deck data is available and has a valid deck_id
    if (!deck || !deck.deck_id) return;

    try {
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
      if (response.data.success) {
        // Update the deck state with the new card and remaining count
        setDeck((prevDeck) => ({
          ...prevDeck,
          cards: [...(prevDeck.cards || []), ...response.data.cards],
          remaining: response.data.remaining,
        }));
      } else {
        setError('Error: no cards remaining!');
      }
    } catch (err) {
      setError('Error drawing card');
    }
  };

  const shuffleDeck = async () => {
    if (!deck || !deck.deck_id) return;

    setIsShuffling(true); // Set shuffling state to true

    try {
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`);
      if (response.data.success) {
        // Reset the deck state with the shuffled deck and clear the cards
        setDeck((prevDeck) => ({
          ...prevDeck,
          cards: [],
          remaining: response.data.remaining,
        }));
      } else {
        setError('Error shuffling deck!');
      }
    } catch (err) {
      setError('Error shuffling deck');
    } finally {
      setIsShuffling(false); // Reset shuffling state to false
    }
  };

  return (
    <div>
      <button onClick={drawCard}>Start Drawing</button>
      <button onClick={shuffleDeck} disabled={isShuffling}>Shuffle Deck</button>
      {error && <p>{error}</p>}
      {deck && deck.cards && deck.cards.map((card, index) => (
        <div key={index}>
          <img src={card.image} alt={`${card.value} of ${card.suit}`} />
          <p>{`${card.value} of ${card.suit}`}</p>
        </div>
      ))}
      {deck && <p>Cards remaining: {deck.remaining}</p>}
    </div>
  );
};

export default DrawCard;
