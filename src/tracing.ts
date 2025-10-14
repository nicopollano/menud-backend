// tracing.ts
/*
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-grpc";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

const traceExporter = new OTLPTraceExporter({
	url: "http://localhost:4317",
});

const metricExporter = new OTLPMetricExporter({
	url: "http://localhost:4317",
});

const sdk = new NodeSDK({
	traceExporter,
	metricReader: new PeriodicExportingMetricReader({
		exporter: metricExporter,
	}),
	instrumentations: [getNodeAutoInstrumentations()],
});

try {
	sdk.start();
	console.log("✅ OpenTelemetry iniciado");
} catch (err) {
	console.error("Error iniciando OTel", err);
}

process.on("SIGTERM", () => {
	sdk.shutdown().finally(() => process.exit(0));
});
*/
