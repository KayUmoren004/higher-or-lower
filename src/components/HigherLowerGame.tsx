/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spade, Heart, Diamond, Club } from "lucide-react";
import { cn } from "@/lib/utils";

type Suit = "H" | "D" | "C" | "S";
type CardType = { rank: number; suit: Suit };

const suits: Record<Suit, React.ElementType> = {
  H: Heart,
  D: Diamond,
  C: Club,
  S: Spade,
};

const rankToString = (rank: number): string => {
  if (rank <= 10) return rank.toString();
  if (rank === 11) return "J";
  if (rank === 12) return "Q";
  if (rank === 13) return "K";
  return "A";
};

const createDeck = (): CardType[] => {
  const ranks = Array.from({ length: 13 }, (_, i) => i + 2);
  const suits: Suit[] = ["H", "D", "C", "S"];
  return ranks.flatMap((rank) => suits.map((suit) => ({ rank, suit })));
};

const shuffle = (array: CardType[]): CardType[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function HigherLowerGame() {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [currentCard, setCurrentCard] = useState<CardType | null>(null);
  const [nextCard, setNextCard] = useState<CardType | null>(null);
  const [pickedCards, setPickedCards] = useState<CardType[]>([]);
  const [round, setRound] = useState(0);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [feedback, setFeedback] = useState("");
  const [revealedCard, setRevealedCard] = useState<CardType | null>(null);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const newDeck = shuffle(createDeck());
    setDeck(newDeck.slice(2));
    setCurrentCard(newDeck[0]);
    setNextCard(newDeck[1]);
    setPickedCards([]);
    setRound(0);
    setGameStatus("playing");
    setFeedback("");
    setRevealedCard(null);
  };

  const handleGuess = (guess: "higher" | "lower") => {
    if (gameStatus !== "playing" || !currentCard || !nextCard) return;

    let newStatus: "playing" | "won" | "lost" = "playing";
    let newFeedback = "";

    if (nextCard.rank === currentCard.rank) {
      newStatus = "lost";
      newFeedback = "Automatic loss! Matching card drawn.";
      setRevealedCard(nextCard);
    } else if (
      (guess === "higher" && nextCard.rank > currentCard.rank) ||
      (guess === "lower" && nextCard.rank < currentCard.rank)
    ) {
      setRound((prev) => prev + 1);
      if (round === 4) {
        newStatus = "won";
        newFeedback = "Congratulations! You won!";
      } else {
        newFeedback = "You guessed correctly!";
      }
    } else {
      newStatus = "lost";
      newFeedback = "Incorrect guess. Game over!";
      setRevealedCard(nextCard);
    }

    setGameStatus(newStatus);
    setFeedback(newFeedback);

    if (newStatus === "playing") {
      setPickedCards((prev) => [...prev, currentCard]);
      setCurrentCard(nextCard);
      setNextCard(deck[0]);
      setDeck((prev) => prev.slice(1));
    }
  };

  const CardDisplay = ({
    card,
    hidden = false,
  }: {
    card: CardType | null;
    hidden?: boolean;
  }) => {
    if (!card) return null;
    const SuitIcon = suits[card.suit];
    return (
      <Card
        className={`w-24 h-36 flex items-center justify-center ${
          hidden ? "bg-gray-300" : ""
        }`}
      >
        <CardContent className="text-center p-2">
          {hidden ? (
            <div className="text-3xl font-bold">?</div>
          ) : (
            <>
              <div className="text-3xl font-bold">
                {rankToString(card.rank)}
              </div>
              <SuitIcon
                className={`w-8 h-8 ${
                  card.suit === "H" || card.suit === "D"
                    ? "text-red-500"
                    : "text-black"
                }`}
              />
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start justify-center w-full max-w-6xl mx-auto my-auto">
      <div className="md:col-span-3 flex flex-wrap gap-8 items-start justify-center w-full mb-8">
        <div className="w-full md:w-auto flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Deck</h2>
          <div className="relative w-24 h-36">
            {[...Array(Math.min(5, deck.length))].map((_, index) => (
              <div
                key={index}
                className="absolute w-24 h-36 bg-gray-200 border-2 border-gray-300 rounded-lg shadow-md"
                style={{
                  top: `${index * 2}px`,
                  left: `${index * 2}px`,
                  zIndex: 5 - index,
                }}
              />
            ))}
          </div>
          <p className="mt-10 text-lg">Cards remaining: {deck.length}</p>
        </div>
        <div className="w-full md:w-auto flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Current Card</h2>
          <CardDisplay card={currentCard} />
          <div className="mt-20 space-x-4">
            <Button
              onClick={() => handleGuess("higher")}
              disabled={gameStatus !== "playing"}
            >
              Higher
            </Button>
            <Button
              onClick={() => handleGuess("lower")}
              disabled={gameStatus !== "playing"}
            >
              Lower
            </Button>
          </div>
        </div>
        <div className="w-full md:w-auto flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Next Card</h2>
          <CardDisplay card={nextCard} hidden={gameStatus === "playing"} />
        </div>
      </div>
      <div
        className={cn(
          "md:col-span-1 md:row-span-2 flex flex-col items-center",
          pickedCards.length === 0 ? "hidden" : ""
        )}
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Your Picked Cards
        </h2>
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          {pickedCards.map((card, index) => (
            <CardDisplay key={index} card={card} />
          ))}
        </div>
      </div>
      <div className="md:col-span-3">
        {feedback && (
          <div className="mt-4 text-lg font-semibold text-center">
            <p>{feedback}</p>
          </div>
        )}
        {gameStatus !== "playing" && (
          <Button onClick={resetGame} className="mt-4 mx-auto block">
            Play Again
          </Button>
        )}
        <p className="mt-4 text-lg text-center">Round: {round}/5</p>
      </div>
    </div>
  );
}
