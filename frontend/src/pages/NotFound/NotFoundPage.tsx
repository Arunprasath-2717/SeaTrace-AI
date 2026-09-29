import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-seatrace-bg-primary text-seatrace-text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-seatrace-bg-surface border border-seatrace-teal/40 flex items-center justify-center text-seatrace-mint mb-4">
        <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
      </div>

      <h1 className="text-4xl font-bold font-mono text-seatrace-mint tracking-wider">
        404
      </h1>
      <h2 className="text-lg font-semibold text-seatrace-text-primary mt-2">
        Coordinates Out of Coverage
      </h2>
      <p className="text-xs text-seatrace-text-secondary max-w-sm mt-1 mb-6">
        The requested maritime investigation route or scene identifier does not exist within the current registry.
      </p>

      <div className="flex gap-3">
        <Link to="/app">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return to Console
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="sm">
            Public Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
