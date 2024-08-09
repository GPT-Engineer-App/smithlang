import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TracesTable from '../components/TracesTable';

const Index = () => {
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsConfigured(true);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">Smithlang</h1>
      {!isConfigured ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Configure Grafana Cloud API</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="apiEndpoint" className="block text-sm font-medium text-gray-700">API Endpoint</label>
                <Input
                  id="apiEndpoint"
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="https://your-grafana-cloud-instance.com/api"
                  required
                />
              </div>
              <div>
                <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700">API Token</label>
                <Input
                  id="apiToken"
                  type="password"
                  value={apiToken}
                  onChange={(e) => setApiToken(e.target.value)}
                  placeholder="Your Grafana Cloud API token"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Configure</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <TracesTable apiEndpoint={apiEndpoint} apiToken={apiToken} />
      )}
    </div>
  );
};

export default Index;
