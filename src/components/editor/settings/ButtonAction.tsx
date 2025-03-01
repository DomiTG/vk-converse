enum ButtonACT {
  REDIRECT,
}
export default interface ButtonAction {
  type: ButtonACT;
  value: string;
}
