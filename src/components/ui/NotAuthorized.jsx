import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft } from "lucide-react";
import { Container, Section, Card, CardContent, Button } from "./index.js";

export function NotAuthorized({ role, requiredRole }) {
  const navigate = useNavigate();
  
  return (
    <Section>
      <Container>
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                <ShieldX size={32} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
              <p className="text-[var(--ce-muted)] mb-6">
                You don't have permission to access this page.
                {role && (
                  <span className="block mt-2">
                    Your role: <strong>{role}</strong>
                    {requiredRole && (
                      <> • Required: <strong>{requiredRole}</strong></>
                    )}
                  </span>
                )}
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft size={16} />
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}

