import "./index.css";
import { Composition } from "remotion";
import { TiktokAd } from "./TiktokAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TiktokAd"
        component={TiktokAd}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
