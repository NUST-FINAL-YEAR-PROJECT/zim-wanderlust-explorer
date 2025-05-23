
import { useState, useEffect } from "react";
import { TransportOperator, getRecommendedTransportForDestination } from "@/models/TransportOperator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TransportOperatorCard from "./TransportOperatorCard";
import { Skeleton } from "@/components/ui/skeleton";

interface TransportRecommendationsProps {
  destinationId: string;
}

const TransportRecommendations = ({ destinationId }: TransportRecommendationsProps) => {
  const [loading, setLoading] = useState(true);
  const [transportOperators, setTransportOperators] = useState<TransportOperator[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "private" | "public" | "air">("all");

  useEffect(() => {
    const fetchTransportOperators = async () => {
      setLoading(true);
      try {
        const operators = await getRecommendedTransportForDestination(destinationId);
        setTransportOperators(operators);
      } catch (error) {
        console.error("Error fetching transport operators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransportOperators();
  }, [destinationId]);

  const filteredOperators = activeTab === "all" 
    ? transportOperators 
    : transportOperators.filter(op => op.type === activeTab);

  return (
    <Card className="mt-8 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <CardTitle className="text-xl font-display font-bold text-indigo-800 dark:text-indigo-300">
          Recommended Transport Options
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Options</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="air">Air</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(i => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-1/3 mb-2" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-20 w-full mb-4" />
                    <div className="flex justify-end">
                      <Skeleton className="h-9 w-28" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredOperators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOperators.map(operator => (
                  <TransportOperatorCard 
                    key={operator.id} 
                    operator={operator} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transport options available for this destination.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="private" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex justify-end">
                    <Skeleton className="h-9 w-28" />
                  </div>
                </div>
              </div>
            ) : filteredOperators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOperators.map(operator => (
                  <TransportOperatorCard 
                    key={operator.id} 
                    operator={operator} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No private transport options available for this destination.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="public" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex justify-end">
                    <Skeleton className="h-9 w-28" />
                  </div>
                </div>
              </div>
            ) : filteredOperators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOperators.map(operator => (
                  <TransportOperatorCard 
                    key={operator.id} 
                    operator={operator} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No public transport options available for this destination.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="air" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex justify-end">
                    <Skeleton className="h-9 w-28" />
                  </div>
                </div>
              </div>
            ) : filteredOperators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOperators.map(operator => (
                  <TransportOperatorCard 
                    key={operator.id} 
                    operator={operator} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No air transport options available for this destination.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TransportRecommendations;
