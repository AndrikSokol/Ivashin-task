import CardItem from "../../components/card/CardItem";
import style from "./IndexPage.module.scss";
const IndexPage = () => {
  return (
    <div className={style["container"]}>
      <CardItem />
      <CardItem />
    </div>
  );
};

export default IndexPage;
