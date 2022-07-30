import Iframe from "react-iframe";

function UserVA() {
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
        User Report
      </h3>
      <Iframe
        url="https://datastudio.google.com/embed/reporting/0b4e9bad-b3e0-4986-a94d-783127fd7550/page/jpUyC"
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

export default UserVA;
