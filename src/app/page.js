"use client";
import React, { useState } from 'react';
import { Plus, RotateCcw, X } from 'lucide-react';

const StatButton = ({ label, value, onClick }) => (
  <button 
    onClick={onClick}
    className="h-12 px-3 text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 
               rounded-md transition-all duration-200 hover:scale-105
               flex items-center justify-between w-full"
  >
    <span className="text-zinc-400 font-medium">{label}</span>
    <div className="flex items-center">
      <span className="text-zinc-100 text-lg font-bold mr-2">{value}</span>
      <Plus size={16} className="text-zinc-400" />
    </div>
  </button>
);

const PlayerCard = ({ player, onUpdateStats, onDelete }) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualStat, setManualStat] = useState({ type: '', value: 0 });

  const stats = {
    points: player.stats.points1 + (player.stats.points2 * 2) + (player.stats.points3 * 3),
    points1: player.stats.points1,
    points2: player.stats.points2,
    points3: player.stats.points3,
    assists: player.stats.assists,
    rebounds: player.stats.rebounds,
    blocks: player.stats.blocks
  };

  const handleManualUpdate = () => {
    if (manualStat.type && manualStat.value) {
      onUpdateStats(player.id, manualStat.type, parseInt(manualStat.value));
      setShowManualInput(false);
      setManualStat({ type: '', value: 0 });
    }
  };

  return (
    <div className="mb-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 
                    rounded-lg transition-all duration-200 shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-bold text-zinc-100">{player.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400 font-medium">POINTS</span>
              <span className="text-2xl font-bold text-zinc-100">{stats.points}</span>
            </div>
          </div>
          <button 
            className="h-8 w-8 flex items-center justify-center rounded-md
                       hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100
                       transition-colors duration-200"
            onClick={() => onDelete(player.id)}
            aria-label="Delete player"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <StatButton 
            label="1 POINT" 
            value={stats.points1}
            onClick={() => onUpdateStats(player.id, 'points1', 1)} 
          />
          <StatButton 
            label="2 POINTS" 
            value={stats.points2}
            onClick={() => onUpdateStats(player.id, 'points2', 1)} 
          />
          <StatButton 
            label="3 POINTS" 
            value={stats.points3}
            onClick={() => onUpdateStats(player.id, 'points3', 1)} 
          />
          <StatButton 
            label="ASSIST" 
            value={stats.assists}
            onClick={() => onUpdateStats(player.id, 'assists', 1)} 
          />
          <StatButton 
            label="REBOUND" 
            value={stats.rebounds}
            onClick={() => onUpdateStats(player.id, 'rebounds', 1)} 
          />
          <StatButton 
            label="BLOCK" 
            value={stats.blocks}
            onClick={() => onUpdateStats(player.id, 'blocks', 1)} 
          />
        </div>

        {!showManualInput ? (
          <button 
            className="w-full h-10 text-sm bg-zinc-800 hover:bg-zinc-700 
                       border border-zinc-700 hover:border-zinc-600 text-zinc-400
                       hover:text-zinc-100 transition-all duration-200 rounded-md
                       font-medium"
            onClick={() => setShowManualInput(true)}
          >
            Manual Fix
          </button>
        ) : (
          <div className="flex gap-2">
            <select 
              className="flex-1 h-10 text-sm border rounded px-2 bg-zinc-800 
                         border-zinc-700 text-zinc-100 focus:border-zinc-600
                         transition-all duration-200 font-medium"
              value={manualStat.type}
              onChange={(e) => setManualStat({ ...manualStat, type: e.target.value })}
            >
              <option value="">Select Stat</option>
              <option value="points1">1 Point</option>
              <option value="points2">2 Points</option>
              <option value="points3">3 Points</option>
              <option value="assists">Assists</option>
              <option value="rebounds">Rebounds</option>
              <option value="blocks">Blocks</option>
            </select>
            <input
              type="number"
              className="w-20 h-10 text-sm bg-zinc-800 border-zinc-700 
                         text-zinc-100 focus:border-zinc-600 rounded-md px-2
                         border transition-all duration-200"
              value={manualStat.value}
              onChange={(e) => setManualStat({ ...manualStat, value: e.target.value })}
            />
            <button 
              className="h-10 px-4 bg-zinc-800 hover:bg-zinc-700
                         transition-all duration-200 rounded-md text-zinc-100
                         font-medium text-sm"
              onClick={handleManualUpdate}
            >
              Update
            </button>
            <button 
              className="h-10 w-10 text-zinc-400 hover:text-zinc-100
                         transition-colors duration-200 flex items-center justify-center
                         hover:bg-zinc-800 rounded-md"
              onClick={() => setShowManualInput(false)}
              aria-label="Cancel edit"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
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
      <div className="max-w-xl mx-auto p-3">
        <div className="flex gap-2 mb-3">
          <input
            placeholder="Enter player name"
            className="h-12 text-base bg-zinc-900 border-zinc-800 text-zinc-100
                      focus:border-zinc-700 rounded-md px-4 flex-1
                      transition-all duration-200 font-medium"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
          />
          <button 
            className="h-12 px-6 bg-zinc-800 hover:bg-zinc-700 transition-all duration-200
                       rounded-md text-zinc-100 font-medium text-base"
            onClick={addPlayer}
          >
            Add
          </button>
          <button 
            className="h-12 w-12 bg-red-900 hover:bg-red-800 transition-all duration-200
                       rounded-md text-zinc-100 flex items-center justify-center
                       hover:scale-105"
            onClick={resetGame}
            aria-label="Reset game"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        {players.length === 0 && (
          <div className="mb-3 py-4 text-base bg-zinc-900 border border-zinc-800 
                         text-zinc-400 rounded-lg px-4 text-center font-medium">
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