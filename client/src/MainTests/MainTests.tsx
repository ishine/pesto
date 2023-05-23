import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FC } from "react";
import useSynth from "../ToneLib/useSynth";
import * as Tone from "tone";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { rawDataConstant } from "../constants/rawData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const MainTests: FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<any | null>(null);
  const synth = useSynth({
    envelope: {
      attack: 0.5,
    },
  });
  const seqRef = useRef<Tone.Sequence | null>(null);

  const rawData = useMemo(() => {
    return [
      { frequency: 419, confidence: 1 },
      { frequency: 499, confidence: 0 },
    ];
  }, []);

  const timeAxisData = useMemo(() => {
    return [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  }, []);

  const chartData = useMemo(() => {
    return {
      labels: rawDataConstant.map((data) => data.frequency),
      datasets: [
        {
          data: timeAxisData,
        },
      ],
      verticalLine: currentTime,
    };
  }, [timeAxisData, currentTime, rawData]);

  const chartOptions = useMemo(() => {
    return {
      indexAxis: "y" as const,
    };
  }, []);

  useEffect(() => {
    seqRef.current = new Tone.Sequence(
      (time, { frequency, confidence }) => {
        if (confidence > 0.8) {
          synth.triggerAttackRelease(frequency, 0.1, time);
        }
      },
      rawDataConstant,
      0.01
    ).start(0);
    return () => {
      seqRef.current?.dispose();
    };
  }, [synth]);

  useEffect(() => {
    const timer = setInterval(() => {
      isPlaying && setCurrentTime(Math.floor(Tone.Transport.seconds));
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, [isPlaying]);

  const handleButtonClick = async () => {
    if (Tone.Transport.state === "started") {
      Tone.Transport.stop();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  const frequencies = useMemo(() => {
    return rawDataConstant.map((d) => d.frequency);
  }, []);

  const noteHeight = 20; // Height of each note block in pixels
  const graphWidth = frequencies.length * 10; // Width of the graph in pixels

  // Calculate the y-coordinate for each frequency
  const maxFrequency = Math.max(...frequencies);
  const minFrequency = Math.min(...frequencies);
  const yScale = noteHeight / (maxFrequency - minFrequency);

  // Generate the data points for the graph
  const noteBlocks = rawDataConstant.map((data, index) => {
    const x = index * 10;
    const y = (maxFrequency - data.frequency) * yScale;

    return (
      <rect
        key={index}
        x={x}
        y={data.frequency}
        width={10}
        height={noteHeight}
        fill={data.confidence > 0.8 ? "blue" : "white"}
        onClick={(e) => console.log(e.target)}
      />
    );
  });

  return (
    <div>
      <button onClick={() => handleButtonClick()}>
        {isPlaying ? "Pause" : "Play"}
      </button>{" "}
      <h1>{currentTime}</h1>
      {/* <Scatter data={chartData} options={chartOptions} /> */}
      {/* <div
        style={{
          width: "100%",
          height: "400px",
          display: "flex",
          position: "relative",
        }}
      >
        {rawDataConstant.map((data, index) => (
          <div
            style={{
              height: `10px`,
              width: "10px",
              backgroundColor: "red",
              position: "absolute",
              left: `calc(${index} * 10)px`,
              bottom: `${data.frequency}`,
            }}
          ></div>
        ))}
      </div> */}
      <svg width={graphWidth} height={maxFrequency}>
        {noteBlocks}
      </svg>
    </div>
  );
};

export default MainTests;
