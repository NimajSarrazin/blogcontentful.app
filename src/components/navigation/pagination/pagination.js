import React from "react";
import { Pagination, Grid } from "@nextui-org/react";

export default function CustomPagination() {
  return (
    <div className="overflow-hidden">
      <Grid.Container gap={2} justify="center">
        <Grid>
          <Pagination rounded total={5} color="warning" />
        </Grid>
      </Grid.Container>
    </div>
  );
}
