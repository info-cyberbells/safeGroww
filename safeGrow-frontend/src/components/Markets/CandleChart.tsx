"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";

interface CandlePoint {
  timestamp: number; // epoch seconds (or ms — we normalize)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface LiveTick {
  ltp: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

interface Props {
  historicalData: CandlePoint[];
  liveTick?: LiveTick | null;
  height?: number;
}

// Normalize: convert ms → seconds if needed
const toSeconds = (ts: number): number =>
  ts > 1e10 ? Math.floor(ts / 1000) : ts;

export default function CandleChart({ historicalData, liveTick, height = 480 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  // ── Initialize chart once on mount ──────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "#0f1117" },
        textColor: "#9ca3af",
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: "#1e2130", style: 1 },
        horzLines: { color: "#1e2130", style: 1 },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#3b82f6", width: 1, style: 1, labelBackgroundColor: "#3b82f6" },
        horzLine: { color: "#3b82f6", width: 1, style: 1, labelBackgroundColor: "#3b82f6" },
      },
      rightPriceScale: { borderColor: "#1e2130" },
      timeScale: {
        borderColor: "#1e2130",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // v5 API: addSeries(SeriesType, options)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#3b82f680",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // Responsive resize observer
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [height]);

  // ── Load historical candles ──────────────────────────────────────────────────
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current) return;
    if (!historicalData || historicalData.length === 0) return;

    const candles: CandlestickData[] = historicalData.map((c) => ({
      time: toSeconds(c.timestamp) as Time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));

    const volumes = historicalData.map((c) => ({
      time: toSeconds(c.timestamp) as Time,
      value: c.volume,
      color: c.close >= c.open ? "#22c55e40" : "#ef444440",
    }));

    candleSeriesRef.current.setData(candles);
    volumeSeriesRef.current.setData(volumes);
    chartRef.current?.timeScale().fitContent();
  }, [historicalData]);

  // ── Update last candle from live tick ───────────────────────────────────────
  // We always update the LAST historical candle's time slot.
  // This avoids placing a future candle far ahead of all historical data,
  // which would cause the chart to jump and the candle to go off-screen.
  useEffect(() => {
    if (!candleSeriesRef.current || !liveTick || historicalData.length === 0) return;
    if (!liveTick.ltp) return;

    const lastHistorical = historicalData[historicalData.length - 1];
    const liveTime = toSeconds(lastHistorical.timestamp) as Time;

    // Use live tick's day OHLC if available, fall back to last historical candle
    const open = liveTick.open > 0 ? liveTick.open : lastHistorical.open;
    const high = liveTick.high > 0 ? Math.max(liveTick.high, liveTick.ltp) : lastHistorical.high;
    const low = liveTick.low > 0 ? Math.min(liveTick.low, liveTick.ltp) : lastHistorical.low;

    candleSeriesRef.current.update({
      time: liveTime,
      open,
      high,
      low,
      close: liveTick.ltp,
    });

    volumeSeriesRef.current?.update({
      time: liveTime,
      value: liveTick.volume || 0,
      color: liveTick.ltp >= open ? "#22c55e40" : "#ef444440",
    });
  }, [liveTick, historicalData]);

  return (
    <div
      ref={containerRef}
      id="candle-chart-container"
      className="w-full rounded-b-xl overflow-hidden"
      style={{ height }}
    />
  );
}
