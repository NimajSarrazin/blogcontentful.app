import React, { useState } from "react";
import { Pagination, Grid, Modal, Button } from "@nextui-org/react";

export default function PaginationAbout() {
  const [paginationModal, setPaginationModal] = useState(false);
  const handleClick = () => {
    setPaginationModal(true);
  };
  const handleClose = () => {
    setPaginationModal(false);
  };
  return (
    <div className="overflow-hidden">
      <Grid.Container gap={2} justify="center">
        <Grid>
          <Pagination
            onlyDots
            rounded
            total={5}
            color="warning"
            onClick={handleClick}
          />
        </Grid>
      </Grid.Container>
      <Modal
        open={paginationModal}
        onClose={handleClose}
        aria-labelledby="pagination-message"
        aria-describedby="pagination-message-description"
      >
        <Modal.Header>
          <h2 id="pagination-message" className="text-xl animate-pulse">
            La pagination arrive bientôt 😊
          </h2>
        </Modal.Header>
        <Modal.Footer justify="center">
          <Button onClick={handleClose} auto>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
