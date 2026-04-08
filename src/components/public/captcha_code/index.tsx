import { TextInput } from "@mantine/core";
import { useState, useEffect, FC } from "react";
import { Tooltip } from "@mantine/core";
import { getCaptcha } from "@/service";

interface CaptchaCodeProps {
  getCaptchaCode: (payload: { code: string; captchaId: string }) => void;
}

const CaptchaCode: FC<CaptchaCodeProps> = ({ getCaptchaCode }) => {
  const [captcha, setCaptcha] = useState<string>("");
  const [captchaId, setCaptchaId] = useState<string>("");
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    void refreshCaptcha();
  }, []);

  const refreshCaptcha = async () => {
    const res = await getCaptcha();
    const payload = res.data.data;
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(payload.svg)}`;
    setCaptcha(svgUrl);
    setCaptchaId(payload.captchaId);
    setCode("");
    getCaptchaCode({
      code: "",
      captchaId: payload.captchaId,
    });
  };

  return (
    <div className="flex gap-2 items-end">
      <TextInput
        label="验证码"
        className="flex-1 theme_gray"
        value={code}
        onChange={(e) => {
          const nextCode = e.target.value;
          setCode(nextCode);
          getCaptchaCode({
            code: nextCode,
            captchaId,
          });
        }}
      />
      <Tooltip label="点击更换" position="bottom" withArrow>
        <img
          src={captcha}
          alt="captcha"
          onClick={() => {
            void refreshCaptcha();
          }}
        />
      </Tooltip>
    </div>
  );
};

export default CaptchaCode;
