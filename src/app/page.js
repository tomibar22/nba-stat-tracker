'use client';
import { useState } from 'react';
import { Plus, Minus, RotateCcw, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';

const StatButton = ({ label, value, onClick }) => (
  <Button 
    onClick={onClick}
    className="h-8 px-2 text-xs"
    variant="outline"
  >
    {label}: {value}
    <Plus size={12} className="ml-1" />
  </Button>
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
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{player.name}</h3>
            <span className="text-sm font-medium">PTS: {stats.points}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-6 w-6"
            onClick={() => onDelete(player.id)}
          >
            <X size={12} />
          </Button>
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
          <Button 
            variant="outline" 
            size="sm"
            className="w-full h-6 text-xs"
            onClick={() => setShowManualInput(true)}
          >
            Fix
          </Button>
        ) : (
          <div className="flex gap-1">
            <select 
              className="flex-1 h-6 text-xs border rounded px-1"
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
            <Input
              type="number"
              className="w-16 h-6 text-xs"
              value={manualStat.value}
              onChange={(e) => setManualStat({ ...manualStat, value: e.target.value })}
            />
            <Button 
              className="h-6 text-xs px-2"
              onClick={handleManualUpdate}
            >
              Set
            </Button>
            <Button 
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => setShowManualInput(false)}
            >
              <X size={12} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
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
    <div className="max-w-xl mx-auto p-2">
      <div className="flex gap-1 mb-2">
        <Input
          placeholder="Player name"
          className="h-8 text-sm"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
        />
        <Button 
          className="h-8"
          onClick={addPlayer}
        >
          Add
        </Button>
        <Button 
          variant="destructive"
          className="h-8"
          onClick={resetGame}
        >
          <RotateCcw size={14} />
        </Button>
      </div>

      {players.length === 0 && (
        <Alert className="mb-2 py-2 text-sm">
          Add players to start tracking stats!
        </Alert>
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
  );
};

export default App;