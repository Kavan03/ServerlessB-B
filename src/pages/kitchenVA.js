import Iframe from "react-iframe";

function KitchenVA() {
  return (
    <div className="Kitchen">
      <h3
        style={{
          fontSize: "30px",
          fontFamily: "sans-serif",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Kitchen Analysis
      </h3>
      <Iframe
        url="https://datastudio.google.com/embed/reporting/58601f9c-bda3-4b4e-8724-6865726e7aa3/page/GpUyC"
        width="100%"
        height="600px"
        id="myId"
        className="KitchenVA"
        display="initial"
        position="relative"
        allowFullScreen
      />
    </div>
  );
}

export default KitchenVA;
