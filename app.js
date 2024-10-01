const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    service: "ASPHarmony",
    version: "1.0.0",
    endpoints: [
      { path: "/", method: "GET", description: "Service information" },
      { path: "/api", method: "GET", description: "API root" },
    ],
  });
});

// API endpoint
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the ASPHarmony API" });
});

// Service metadata endpoint
app.get("/$metadata", (req, res) => {
  if (req.accepts("json")) {
    res.json({
      serviceName: "ASPHarmony",
      version: "1.0.0",
      description: "A simple API service for ASPHarmony",
      endpoints: [
        {
          path: "/",
          method: "GET",
          description: "Service information",
          responseFormat: {
            service: "string",
            version: "string",
            endpoints: "array",
          },
        },
        {
          path: "/api",
          method: "GET",
          description: "API root",
          responseFormat: {
            message: "string",
          },
        },
      ],
      dataTypes: {},
      authenticationMethod: "None",
      contactInformation: {
        developer: "TableHarmony",
        email: "contact@tableharmony.com",
      },
    });
  } else {
    res.type("application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<edmx:Edmx xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx" Version="4.0">
  <edmx:DataServices>
    <Schema xmlns="http://docs.oasis-open.org/odata/ns/edm" Namespace="ASPHarmony.Models">
      <EntityContainer Name="ASPHarmonyService">
        <EntitySet Name="ServiceInfo" EntityType="ASPHarmony.Models.ServiceInfo">
          <Annotation Term="OData.PublishingService">
            <Record>
              <PropertyValue Property="Name" String="ASPHarmony" />
              <PropertyValue Property="Version" String="1.0.0" />
            </Record>
          </Annotation>
        </EntitySet>
        <FunctionImport Name="GetServiceInfo" ReturnType="ASPHarmony.Models.ServiceInfo" />
        <FunctionImport Name="GetApiRoot" ReturnType="ASPHarmony.Models.ApiRoot" />
      </EntityContainer>
      <EntityType Name="ServiceInfo">
        <Property Name="Service" Type="Edm.String" />
        <Property Name="Version" Type="Edm.String" />
        <Property Name="Endpoints" Type="Collection(ASPHarmony.Models.Endpoint)" />
      </EntityType>
      <EntityType Name="Endpoint">
        <Property Name="Path" Type="Edm.String" />
        <Property Name="Method" Type="Edm.String" />
        <Property Name="Description" Type="Edm.String" />
      </EntityType>
      <EntityType Name="ApiRoot">
        <Property Name="Message" Type="Edm.String" />
      </EntityType>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>`);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
