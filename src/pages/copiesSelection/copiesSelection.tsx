import { useNavigate } from "react-router-dom";
import CandidHeading from "../../components/candidHeader";
import CircularBtn from "../../components/circularBtn";
import { useCandidContext } from "../../context/storeContext";
import "./copiesStyling.css";

const CopiesSelection = () => {
  const navigate = useNavigate();
  const { numberOfCopies, setNumberOfCopies } = useCandidContext();
  const pricePerCopy = 200;

  const handleCopyBtnClick = (copiesWanted: number) => {
    setNumberOfCopies(copiesWanted);
  };

  const navigateToNextPage = () => {
    navigate("/layout");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container evenly-spaced-col">
      <button type="button" className="back-btn-small" onClick={handleBack} title="Quay lại">← Quay lại</button>
      <CandidHeading text="CANDID PHOTOBOOTH" />
      <div className="copies-row">
        {[...Array(4)].map((_, index) => (
          <img
            key={index}
            className={`dummy-polaroid-img
              ${numberOfCopies < index + 1 ? "dull-img" : ""}`}
            src="/assets/images/png/dummyPolaroid.png"
            alt={`Dummy Polaroid ${index + 1}`}
            onClick={() => handleCopyBtnClick(index + 1)}
          />
        ))}
      </div>
      <div className="copies-row">
        <div className="copy-text-container">
          <p className="copy-text">How many copies would you like ?</p>
        </div>
        <div className="copies-btn-row">
          {[...Array(4)].map((_, index) => (
            <button
              key={index}
              className={`copy-btn default
                ${numberOfCopies < index + 1 ? "default" : "highlight"}`}
              onClick={() => handleCopyBtnClick(index + 1)}
            />
          ))}
        </div>
      </div>
      <div className="price-row">
        <h1 className="price-text bungee-text">
          Rs. {pricePerCopy * numberOfCopies}
        </h1>
        <div className="next-icon-placement">
          <CircularBtn
            onClick={() => {
              navigateToNextPage();
            }}
            buttonText="READY TO BE CANDID"
            iconUrl="/assets/images/png/next_icon.png"
          />
        </div>
      </div>
    </div>
  );
};

export default CopiesSelection;
