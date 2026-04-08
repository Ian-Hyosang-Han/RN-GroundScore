import React, { createContext, useContext, useState } from 'react';

export type PlayType = 'solo' | 'group';
export type HoleType = 9 | 18;

export type Player = {
  id: string;
  name: string;
};

export type SoloScoreData = {
  par: number[];
  on: number[];
  putt: number[];
};

export type GroupScoreData = {
  par: number[];
  players: {
    playerId: string;
    playerName: string;
    scores: number[];
  }[];
};

export type GameSetupState = {
  playType: PlayType | null;
  courseName: string;
  players: Player[];
  holes: HoleType | null;
  gameDate: string;
  soloScoreData: SoloScoreData | null;
  groupScoreData: GroupScoreData | null;
};

type GameSetupContextType = {
  setup: GameSetupState;
  setPlayType: (type: PlayType) => void;
  setCourseName: (name: string) => void;
  setPlayers: (players: Player[]) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  updatePlayer: (id: string, name: string) => void;
  setHoles: (holes: HoleType) => void;
  setGameDate: (date: string) => void;
  initializeScoreCard: () => void;
  updateSoloCell: (row: 'par' | 'on' | 'putt', index: number, value: number) => void;
  updateGroupCell: (playerId: string, index: number, value: number) => void;
  updateParValues: (values: number[]) => void;
  resetSetup: () => void;
};

const initialState: GameSetupState = {
  playType: null,
  courseName: '',
  players: [],
  holes: null,
  gameDate: new Date().toISOString().split('T')[0],
  soloScoreData: null,
  groupScoreData: null,
};

const GameSetupContext = createContext<GameSetupContextType | undefined>(undefined);

export function GameSetupProvider({ children }: { children: React.ReactNode }) {
  const [setup, setSetup] = useState<GameSetupState>(initialState);

  const setPlayType = (type: PlayType) => {
    setSetup(prev => ({
      ...prev,
      playType: type,
      players:
        type === 'solo'
          ? [{ id: 'solo-player', name: 'Player 1' }]
          : [],
      soloScoreData: null,
      groupScoreData: null,
    }));
  };

  const setCourseName = (name: string) => {
    setSetup(prev => ({
      ...prev,
      courseName: name,
    }));
  };

  const setPlayers = (players: Player[]) => {
    setSetup(prev => ({
      ...prev,
      players,
    }));
  };

  const addPlayer = (name: string) => {
    setSetup(prev => ({
      ...prev,
      players: [
        ...prev.players,
        {
          id: Date.now().toString(),
          name,
        },
      ],
    }));
  };

  const removePlayer = (id: string) => {
    setSetup(prev => ({
      ...prev,
      players: prev.players.filter(player => player.id !== id),
    }));
  };

  const updatePlayer = (id: string, name: string) => {
    setSetup(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === id ? { ...player, name } : player
      ),
    }));
  };

  const setHoles = (holes: HoleType) => {
    setSetup(prev => ({
      ...prev,
      holes,
    }));
  };

  const setGameDate = (date: string) => {
    setSetup(prev => ({
      ...prev,
      gameDate: date,
    }));
  };

  const initializeScoreCard = () => {
    setSetup(prev => {
      if (!prev.holes || !prev.playType) {
        return prev;
      }

      const holes = prev.holes;
      const par = Array.from({ length: holes }, () => 4);

      if (prev.playType === 'solo') {
        return {
          ...prev,
          soloScoreData: {
            par,
            on: Array.from({ length: holes }, () => 0),
            putt: Array.from({ length: holes }, () => 0),
          },
          groupScoreData: null,
        };
      }

      return {
        ...prev,
        groupScoreData: {
          par,
          players: prev.players.map(player => ({
            playerId: player.id,
            playerName: player.name,
            scores: Array.from({ length: holes }, () => 0),
          })),
        },
        soloScoreData: null,
      };
    });
  };

  const updateSoloCell = (row: 'par' | 'on' | 'putt', index: number, value: number) => {
    setSetup(prev => {
      if (!prev.soloScoreData) {
        return prev;
      }

      const updatedRow = [...prev.soloScoreData[row]];
      updatedRow[index] = value;

      return {
        ...prev,
        soloScoreData: {
          ...prev.soloScoreData,
          [row]: updatedRow,
        },
      };
    });
  };

  const updateGroupCell = (playerId: string, index: number, value: number) => {
    setSetup(prev => {
      if (!prev.groupScoreData) {
        return prev;
      }

      return {
        ...prev,
        groupScoreData: {
          ...prev.groupScoreData,
          players: prev.groupScoreData.players.map(player =>
            player.playerId === playerId
              ? {
                  ...player,
                  scores: player.scores.map((score, i) =>
                    i === index ? value : score
                  ),
                }
              : player
          ),
        },
      };
    });
  };

  const updateParValues = (values: number[]) => {
    setSetup(prev => {
      if (prev.soloScoreData) {
        return {
          ...prev,
          soloScoreData: {
            ...prev.soloScoreData,
            par: values,
          },
        };
      }

      if (prev.groupScoreData) {
        return {
          ...prev,
          groupScoreData: {
            ...prev.groupScoreData,
            par: values,
          },
        };
      }

      return prev;
    });
  };

  const resetSetup = () => {
    setSetup(initialState);
  };

  const value: GameSetupContextType = {
    setup,
    setPlayType,
    setCourseName,
    setPlayers,
    addPlayer,
    removePlayer,
    updatePlayer,
    setHoles,
    setGameDate,
    initializeScoreCard,
    updateSoloCell,
    updateGroupCell,
    updateParValues,
    resetSetup,
  };

  return (
    <GameSetupContext.Provider value={value}>
      {children}
    </GameSetupContext.Provider>
  );
}

export function useGameSetup() {
  const context = useContext(GameSetupContext);

  if (!context) {
    throw new Error('useGameSetup must be used within GameSetupProvider');
  }

  return context;
}