import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchTraces = async (apiEndpoint, username, password) => {
  const query = encodeURIComponent('{name="ChatAnthropic.chat"} | select(.gen_ai.completion.0.content, .gen_ai.prompt.1.content)');
  const response = await fetch(`${apiEndpoint}/api/search?q=${query}`, {
    headers: {
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch traces');
  }
  return response.json();
};

const TracesTable = ({ apiEndpoint, username, password }) => {
  const { data: traces, isLoading, error } = useQuery({
    queryKey: ['traces', apiEndpoint, username, password],
    queryFn: () => fetchTraces(apiEndpoint, username, password),
  });

  if (isLoading) return <div>Loading traces...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traces</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trace ID</TableHead>
              <TableHead>Prompt</TableHead>
              <TableHead>Completion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {traces.traces.map((trace) => (
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
};

export default TracesTable;
