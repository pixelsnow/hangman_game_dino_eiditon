import { useContext, useEffect } from "react";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../context/auth-context";
import { getAllScoreDispatch } from "../../features/PlayerSlice";
import { signInUser } from "../../firebase/firebase";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  AllScore_Type,
  Player_ScoreBoard_Type,
  ScoreBoard_Type,
} from "../../types/hangman.model";
import BtnSuccess from "../Button/success/BtnSuccess";
import classes from "./leaderboard.module.css";

const LeaderBoard = () => {
  // const { leaderboard } = useAppSelector((state) => state.game);
  const { signOut, currentUser } = useContext(AuthContext);
  const { allScore } = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllScoreDispatch());
  }, [dispatch]);
  const renderDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  const renderEmail = (email: string) => {
    const [name, domain] = email.split("@");
    const obfuscatedName = `${name.charAt(0)}${"*".repeat(
      name.length - 2
    )}${name.charAt(name.length - 1)}`;
    const obfuscatedDomain = `${domain.charAt(0)}${"*".repeat(
      domain.length - 2
    )}${domain.charAt(domain.length - 1)}`;
    return `${obfuscatedName}@${obfuscatedDomain}`;
  };
  const restructureLeaderBoard = (
    allScore: AllScore_Type
  ): { email: string; name: string; score: number; timestamp: number }[] => {
    const newArray: {
      email: string;
      name: string;
      score: number;
      timestamp: number;
    }[] = [];

    Object.values(allScore).forEach(([player, ...scores]) => {
      const { email, name } = player as Player_ScoreBoard_Type;
      scores.forEach((i) => {
        const { score, timestamp } = i as ScoreBoard_Type;
        newArray.push({ email, name, score, timestamp });
      });
    });

    return newArray.sort((a, b) => b.score - a.score);
    // return []
  };

  const renderScoreTable = (allScore: AllScore_Type) => {
    return (
      <table className={classes.leaderboard}>
        <thead>
          <tr className={classes.table_header}>
            <th></th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {restructureLeaderBoard(allScore).map((data, index) => {
            const { name, score, timestamp } = data;
            return (
              <tr className={classes.table_row}>
                <td>{index}</td>
                <td>{name}</td>
                {/* <td>{renderDate(timestamp)} :</td> */}
                <td>{score}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className={classes.leaderboard_container}>
      <h2>Leaderboard</h2>
      {allScore && renderScoreTable(allScore)}
    </div>
  );
};

export default LeaderBoard;
