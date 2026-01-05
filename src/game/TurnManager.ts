export class TurnManager {
  current: "player" | "enemy" = "player";

  next() {
    this.current = this.current === "player" ? "enemy" : "player";
  }
}
