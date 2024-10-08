import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TracesTable from '../components/TracesTable';

const Index = () => {
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedApiEndpoint = localStorage.getItem('apiEndpoint');
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedApiEndpoint && savedUsername && savedPassword) {
      setApiEndpoint(savedApiEndpoint);
      setUsername(savedUsername);
      setPassword(savedPassword);
      setIsConfigured(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiEndpoint.endsWith('/')) {
      setApiEndpoint(apiEndpoint.slice(0, -1));
    }
    localStorage.setItem('apiEndpoint', apiEndpoint);
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    setError('');
    setIsConfigured(true);
  };

  const handleReset = () => {
    localStorage.removeItem('apiEndpoint');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    setApiEndpoint('');
    setUsername('');
    setPassword('');
    setIsConfigured(false);
    setError('');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">Smithlang Trace Viewer</h1>
      {!isConfigured ? (
        <Card className="max-w-md mx-auto bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-blue-400">Configure Grafana Tempo API</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="apiEndpoint" className="block text-sm font-medium text-gray-300">API Endpoint</label>
                <Input
                  id="apiEndpoint"
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="https://your-grafana-cloud-instance.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">Username</label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your Grafana Cloud username"
                  required
                  className="bg-gray-700 text-gray-100 border-gray-600"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your Grafana Cloud password"
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Configure</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <Button onClick={handleReset} className="mb-4 bg-red-600 hover:bg-red-700 text-white">Reset Configuration</Button>
          <TracesTable apiEndpoint={apiEndpoint} username={username} password={password} />
        </>
      )}
    </div>
  );
};

export default Index;
