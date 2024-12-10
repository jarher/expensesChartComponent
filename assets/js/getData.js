const getData = async () => {
  try {
    const res = await fetch("../../data.json");
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getData;
