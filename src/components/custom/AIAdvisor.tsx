
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const AIAdvisor = () => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-blue-800">
          AI Advisor
        </CardTitle>
        <Lightbulb className="w-5 h-5 text-blue-600" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>
            <strong>Insight:</strong> The average completion time for service requests has decreased by 5% this month. Keep up the great work!
          </li>
          <li>
            <strong>Recommendation:</strong> Consider offering a discount on accessories for the "Laptop Pro X" to boost sales, as it has the highest number of service requests.
          </li>
          <li>
            <strong>Prediction:</strong> Based on current trends, we predict a 10% increase in service requests for "Smartphone Z" next quarter.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default AIAdvisor;
