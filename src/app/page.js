"use client";
import React, { useState } from 'react';
import { Plus, RotateCcw, X } from 'lucide-react';

const StatButton = ({ label, value, onClick }) => (
  <button 
    onClick={onClick}
    className="h-14 px-3 text-base bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 
               rounded-md transition-all duration-200
               flex items-center justify-between w-full"
  >
    <span className="text-zinc-400">{label}</span>
    <Plus size={20} className="text-zinc-400" />
  </button>
);

const PlayerCard = ({ player, onUpdateStats, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const stats = {
    points: player.stats.points1 + (player.stats.points2 * 2) + (player.stats.points3 * 3),
    points1: player.stats.points1,
    points2: player.stats.points2,
    points3: player.stats.points3,
    assists: player.stats.assists,
    rebounds: player.stats.rebounds,
    blocks: player.stats.blocks
  };

  const handleStatClick = (statType) => {
    onUpdateStats(player.id, statType, 1);
  };

  return (
    <div className="mb-3">
      <div 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`bg-zinc-900 border ${isMenuOpen ? 'border-zinc-700' : 'border-zinc-800'} 
                   hover:border-zinc-700 rounded-lg transition-all duration-200 cursor-pointer`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold text-zinc-100">{player.name}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-base text-zinc-400">POINTS</span>
                  <span className="text-2xl font-bold text-zinc-100">{stats.points}</span>
                </div>
                {stats.assists > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-base text-zinc-400">AST</span>
                    <span className="text-xl font-bold text-zinc-100">{stats.assists}</span>
                  </div>
                )}
                {stats.rebounds > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-base text-zinc-400">REB</span>
                    <span className="text-xl font-bold text-zinc-100">{stats.rebounds}</span>
                  </div>
                )}
                {stats.blocks > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-base text-zinc-400">BLK</span>
                    <span className="text-xl font-bold text-zinc-100">{stats.blocks}</span>
                  </div>
                )}
              </div>
            </div>
            <button 
              className="h-10 w-10 flex items-center justify-center rounded-md
                         hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100
                         transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(player.id);
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mt-2 grid grid-cols-2 gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
          <StatButton 
            label="1 POINT" 
            value={stats.points1}
            onClick={() => handleStatClick('points1')} 
          />
          <StatButton 
            label="2 POINTS" 
            value={stats.points2}
            onClick={() => handleStatClick('points2')} 
          />
          <StatButton 
            label="3 POINTS" 
            value={stats.points3}
            onClick={() => handleStatClick('points3')} 
          />
          <StatButton 
            label="ASSISTS" 
            value={stats.assists}
            onClick={() => handleStatClick('assists')} 
          />
          <StatButton 
            label="REBOUNDS" 
            value={stats.rebounds}
            onClick={() => handleStatClick('rebounds')} 
          />
          <StatButton 
            label="BLOCKS" 
            value={stats.blocks}
            onClick={() => handleStatClick('blocks')} 
          />
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer = {
        id: Date.now(),
        name: newPlayerName.trim(),
        stats: {
          points1: 0,
          points2: 0,
          points3: 0,
          assists: 0,
          rebounds: 0,
          blocks: 0
        }
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const updatePlayerStats = (playerId, statType, value) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          stats: {
            ...player.stats,
            [statType]: player.stats[statType] + value
          }
        };
      }
      return player;
    }));
  };

  const deletePlayer = (playerId) => {
    setPlayers(players.filter(player => player.id !== playerId));
  };

  const resetGame = () => {
    setPlayers([]);
    setNewPlayerName('');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-md mx-auto p-3">
        <div className="flex gap-2 mb-3">
          <input
            placeholder="Enter player name"
            className="h-12 text-lg bg-zinc-900 border-zinc-800 text-zinc-100
                      focus:border-zinc-700 rounded-md px-4 flex-1
                      transition-all duration-200"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
          />
          <button 
            className="h-12 px-6 bg-zinc-800 hover:bg-zinc-700 transition-all duration-200
                       rounded-md text-zinc-100 font-medium text-lg"
            onClick={addPlayer}
          >
            Add
          </button>
          <button 
            className="h-12 w-12 bg-red-900 hover:bg-red-800 transition-all duration-200
                       rounded-md text-zinc-100 flex items-center justify-center"
            onClick={resetGame}
          >
            <RotateCcw size={24} />
          </button>
        </div>

        {players.length === 0 && (
          <div className="mb-3 py-4 text-lg bg-zinc-900 border border-zinc-800 
                         text-zinc-400 rounded-lg px-4 text-center">
            Add players to start tracking stats!
          </div>
        )}

        <div className="space-y-3">
          {players.map(player => (
            <PlayerCard
              key={player.id}
              player={player}
              onUpdateStats={updatePlayerStats}
              onDelete={deletePlayer}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;