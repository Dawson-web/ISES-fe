function layoutFunction(
  setVercel: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (localStorage.getItem("vercel") == "true") {
    setVercel(true);
  } else if (localStorage.getItem("vercel") == "false") {
    setVercel(false);
  } else {
    localStorage.setItem("vercel", "false");
  }
}
function setLayoutFunction(vercel: boolean) {
  if (vercel) {
    localStorage.setItem("vercel", "true");
  } else {
    localStorage.setItem("vercel", "false");
  }
}

export { layoutFunction, setLayoutFunction };
