import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetchTraces = async (apiEndpoint, apiToken) => {
  const response = await fetch(`${apiEndpoint}/traces`, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch traces');
  }
  return response.json();
};

const TracesTable = ({ apiEndpoint, apiToken }) => {
  const { data: traces, isLoading, error } = useQuery({
    queryKey: ['traces', apiEndpoint, apiToken],
    queryFn: () => fetchTraces(apiEndpoint, apiToken),
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
              <TableHead>Service Name</TableHead>
              <TableHead>Operation Name</TableHead>
              <TableHead>Duration (ms)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {traces.map((trace) => (
              <TableRow key={trace.traceID}>
                <TableCell>{trace.traceID}</TableCell>
                <TableCell>{trace.serviceName}</TableCell>
                <TableCell>{trace.operationName}</TableCell>
                <TableCell>{trace.durationMs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TracesTable;
