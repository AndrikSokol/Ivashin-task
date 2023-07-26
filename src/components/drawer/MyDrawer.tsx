// import Box from "@mui/material/Box";
// import SwipeableDrawer from "@mui/material/SwipeableDrawer";
// import Drawer from "@mui/material/Drawer";
// import Button from "@mui/material/Button";
// import React, { FC } from "react";

// type MyDrawerProps = {
//   isOpenDrawer: boolean;
//   setIsOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
// };
// const MyDrawer: FC<MyDrawerProps> = ({ setIsOpenDrawer, isOpenDrawer }) => {
//   const [state, setState] = React.useState<boolean>(true);

//   React.useEffect(() => {
//     if (isOpenDrawer && !state) {
//       setIsOpenDrawer(false);
//       setState(true);
//     }
//   }, [state]);
//   return (
//     <Drawer open={state} onClose={() => setState(false)}>
//       <Box
//         sx={{ width: 250 }}
//         role="presentation"
//         onClick={() => setState(false)}
//         onKeyDown={() => setState(false)}
//       >
//         <Button variant="outlined">Добавить заметку</Button>
//       </Box>
//     </Drawer>
//   );
// };

// export default MyDrawer;
