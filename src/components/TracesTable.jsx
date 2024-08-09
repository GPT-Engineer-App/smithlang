import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const mockTraces = [
  {
    traceID: "mock-trace-1",
    spanSets: [{
      attributes: {
        '.gen_ai.prompt.1.content': "What is the capital of France?",
        '.gen_ai.completion.0.content': "The capital of France is Paris."
      }
    }]
  },
  {
    traceID: "mock-trace-2",
    spanSets: [{
      attributes: {
        '.gen_ai.prompt.1.content': "Explain quantum computing in simple terms.",
        '.gen_ai.completion.0.content': "Quantum computing uses quantum mechanics to perform complex calculations much faster than traditional computers."
      }
    }]
  },
  {
    traceID: "mock-trace-3",
    spanSets: [{
      attributes: {
        '.gen_ai.prompt.1.content': "What are the benefits of regular exercise?",
        '.gen_ai.completion.0.content': "Regular exercise improves physical health, mental well-being, and can help prevent various diseases."
      }
    }]
  }
];

const fetchTraces = async (apiEndpoint, username, password) => {
  const query = encodeURIComponent('{name="ChatAnthropic.chat"} | select(.gen_ai.completion.0.content, .gen_ai.prompt.1.content)');
  try {
    const response = await fetch(`${apiEndpoint}/tempo/api/search?q=${query}`, {
      headers: {
        'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch traces: ${response.status} ${response.statusText}. ${errorText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching traces:', error);
    throw error;
  }
};

const TracesTable = ({ apiEndpoint, username, password }) => {
  const { data: traces, isLoading, error } = useQuery({
    queryKey: ['traces', apiEndpoint, username, password],
    queryFn: () => fetchTraces(apiEndpoint, username, password),
  });

  if (isLoading) return <div>Loading traces...</div>;
  if (error) {
    console.error('Error fetching traces:', error);
    return renderTracesTable(mockTraces, true);
  }

  if (!traces || traces.traces.length === 0) {
    return renderTracesTable(mockTraces, true);
  }

  return renderTracesTable(traces.traces, false);
};

const renderTracesTable = (traces, isMockData) => (
  <Card>
    <CardHeader>
      <CardTitle>
        Traces {isMockData && <span className="text-sm font-normal text-muted-foreground">(Mock Data)</span>}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {isMockData && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Using Mock Data</AlertTitle>
          <AlertDescription>
            Unable to fetch real data. Displaying mock traces for demonstration purposes.
          </AlertDescription>
        </Alert>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trace ID</TableHead>
            <TableHead>Prompt</TableHead>
            <TableHead>Completion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {traces.map((trace) => (
            <TableRow key={trace.traceID}>
              <TableCell>{trace.traceID}</TableCell>
              <TableCell>{trace.spanSets[0].attributes['.gen_ai.prompt.1.content']}</TableCell>
              <TableCell>{trace.spanSets[0].attributes['.gen_ai.completion.0.content']}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default TracesTable;
