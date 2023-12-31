import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import ConfigProvider from "antd/lib/config-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { api } from "~/utils/api";
import theme from "~/theme/themeConfig";
import "react-toastify/dist/ReactToastify.css";
import "~/styles/globals.css";
import { useEffect } from "react";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import {
  stateColorIndex,
  stateColorsLength,
  stateColor,
  stateColors,
} from "~/states";
import { ToastContainer } from "react-toastify";
import { Snow } from "~/components/Snow";
import MusicButton from "~/components/Music";

function ColorChanger() {
  const color = useRecoilValue(stateColor);
  const [colors] = useRecoilState(stateColors);
  const [colorIndex, setColorIndex] = useRecoilState(stateColorIndex);
  const colorsLength = useRecoilValue(stateColorsLength);
  useEffect(() => {
    const timer = setInterval(() => {
      if (colorIndex + 1 > colorsLength - 1) {
        setColorIndex(0);
        return;
      }
      setColorIndex(colorIndex + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [colorIndex, colorsLength]);
  useEffect(() => {
    if (color) document.body.style.background = color;
  }, [color, colors, colorIndex, colorsLength]);
  return null;
}
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <RecoilRoot>
      <SessionProvider session={session}>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <ColorChanger />
        <ConfigProvider theme={theme}>
          <MusicButton />
          <Snow />
          <Analytics />
          <SpeedInsights />
          <Component {...pageProps} />
        </ConfigProvider>
      </SessionProvider>
    </RecoilRoot>
  );
};

export default api.withTRPC(MyApp);
