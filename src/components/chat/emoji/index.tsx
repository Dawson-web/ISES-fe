import { Card } from "@mantine/core";
import clsx from "clsx";
import { FC } from "react";

let Emoji = [
  "&#128512;",
  "&#128513;",
  "&#128514;",
  "&#128515;",
  "&#128516;",
  "&#128517;",
  "&#128518",
  "&#128519",
  "&#128520",
  "&#128521",
  "&#128522",
  "&#128523",
  "&#128524",
  "&#128525",
  "&#128526",
  "&#128527",
  "&#128528",
  "&#128529",
  "&#128530",
  "&#128530",
  "&#128531",
  "&#128532",
  "&#128533",
  "&#128534",
  "&#128535",
  "&#128536",
  "&#128537",
  "&#128538",
  "&#128539",
  "&#128540",
  "&#128541",
  "&#128542",
  "&#128543",
  "&#128544",
  "&#128545",
  "&#128546",
  "&#128547",
  "&#128548",
  "&#128549",
  "&#128550",
  "&#128551",
  "&#128552",
  "&#128553",
  "&#128554",
  "&#128555",
  "&#128556",
  "&#128557",
  "&#128558",
  "&#128559",
];

interface IProps {
  onEmojiClick: (emoji: string) => void;
  onClose: () => void;
  className?: string;
}

const EmojiContainer: FC<IProps> = ({ onEmojiClick, onClose, className }) => {
  const emoji = document.getElementById("emoji");
  Emoji.forEach((item) => {
    const span = document.createElement("span");
    span.innerHTML = item;
    span.addEventListener("click", () => {
      onEmojiClick(item);
    });
    emoji?.appendChild(span);
  });

  return (
    <Card className={clsx("w-[300px]  overflow-scroll", className)}>
      <div id="emoji" className={clsx("flex flex-wrap gap-1")}></div>
    </Card>
  );
};

export default EmojiContainer;
