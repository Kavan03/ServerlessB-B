import Iframe from "react-iframe";

function RoomVA() {
  return (
    <div className="Room">
      <h3
        style={{
          fontSize: "30px",
          fontFamily: "sans-serif",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Room Booking Analysis
      </h3>
      <Iframe
        url="https://datastudio.google.com/embed/reporting/1ae2f104-4453-4f34-947f-5837c0443a88/page/dpUyC"
        width="100%"
        height="600px"
        id="myId"
        className="RoomVA"
        display="initial"
        position="relative"
        allowFullScreen
      />
    </div>
  );
}

export default RoomVA;
