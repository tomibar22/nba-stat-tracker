"use client";
import React, { useState } from 'react';
import { Plus, RotateCcw, X } from 'lucide-react';

const StatButton = ({ label, value, onClick }) => (
  <button 
    onClick={onClick}
    className="h-8 px-2 text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 
               rounded-md transition-all duration-200 hover:scale-105
               flex items-center justify-between w-full"
  >
    <span className="text-zinc-400">{label}</span>
    <div className="flex items-center">
      <span className="text-zinc-100 mr-1">{value}</span>
      <Plus size={12} className="text-zinc-400" />
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
    <div className="mb-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 
                    rounded-lg transition-all duration-200">
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-zinc-100">{player.name}</h3>
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-400">PTS</span>
              <span className="text-sm font-medium text-zinc-100">{stats.points}</span>
            </div>
          </div>
          <button 
            className="h-6 w-6 flex items-center justify-center rounded-md
                       hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100
                       transition-colors duration-200"
            onClick={() => onDelete(player.id)}
          >
            <X size={12} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 mb-2">
          <StatButton 
            label="1PT" 
            value={stats.points1}
            onClick={() => onUpdateStats(player.id, 'points1', 1)} 
          />
          <StatButton 
            label="2PT" 
            value={stats.points2}
            onClick={() => onUpdateStats(player.id, 'points2', 1)} 
          />
          <StatButton 
            label="3PT" 
            value={stats.points3}
            onClick={() => onUpdateStats(player.id, 'points3', 1)} 
          />
          <StatButton 
            label="AST" 
            value={stats.assists}
            onClick={() => onUpdateStats(player.id, 'assists', 1)} 
          />
          <StatButton 
            label="REB" 
            value={stats.rebounds}
            onClick={() => onUpdateStats(player.id, 'rebounds', 1)} 
          />
          <StatButton 
            label="BLK" 
            value={stats.blocks}
            onClick={() => onUpdateStats(player.id, 'blocks', 1)} 
          />
        </div>

        {!showManualInput ? (
          <button 
            className="w-full h-6 text-xs bg-zinc-800 hover:bg-zinc-700 
                       border border-zinc-700 hover:border-zinc-600 text-zinc-400
                       hover:text-zinc-100 transition-all duration-200 rounded-md"
            onClick={() => setShowManualInput(true)}
          >
            Fix
          </button>
        ) : (
          <div className="flex gap-1">
            <select 
              className="flex-1 h-6 text-xs border rounded px-1 bg-zinc-800 
                         border-zinc-700 text-zinc-100 focus:border-zinc-600
                         transition-all duration-200"
              value={manualStat.type}
              onChange={(e) => setManualStat({ ...manualStat, type: e.target.value })}
            >
              <option value="">Stat</option>
              <option value="points1">1PT</option>
              <option value="points2">2PT</option>
              <option value="points3">3PT</option>
              <option value="assists">AST</option>
              <option value="rebounds">REB</option>
              <option value="blocks">BLK</option>
            </select>
            <input
              type="number"
              className="w-16 h-6 text-xs bg-zinc-800 border-zinc-700 
                         text-zinc-100 focus:border-zinc-600 rounded-md px-1
                         border transition-all duration-200"
              value={manualStat.value}
              onChange={(e) => setManualStat({ ...manualStat, value: e.target.value })}
            />
            <button 
              className="h-6 text-xs px-2 bg-zinc-800 hover:bg-zinc-700
                         transition-all duration-200 rounded-md text-zinc-100"
              onClick={handleManualUpdate}
            >
              Set
            </button>
            <button 
              className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-100
                         transition-colors duration-200 flex items-center justify-center"
              onClick={() => setShowManualInput(false)}
            >
              <X size={12} />
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
      <div className="max-w-xl mx-auto p-2">
        <div className="flex gap-1 mb-2">
          <input
            placeholder="Player name"
            className="h-8 text-sm bg-zinc-900 border-zinc-800 text-zinc-100
                      focus:border-zinc-700 rounded-md px-2 flex-1
                      transition-all duration-200"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
          />
          <button 
            className="h-8 px-3 bg-zinc-800 hover:bg-zinc-700 transition-all duration-200
                       rounded-md text-zinc-100"
            onClick={addPlayer}
          >
            Add
          </button>
          <button 
            className="h-8 w-8 bg-red-900 hover:bg-red-800 transition-all duration-200
                       rounded-md text-zinc-100 flex items-center justify-center
                       hover:scale-105"
            onClick={resetGame}
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {players.length === 0 && (
          <div className="mb-2 py-2 text-sm bg-zinc-900 border border-zinc-800 
                         text-zinc-400 rounded-lg px-3">
            Add players to start tracking stats!
          </div>
        )}

        <div className="space-y-2">
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