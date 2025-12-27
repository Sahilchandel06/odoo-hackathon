import { Droppable, Draggable } from "@hello-pangea/dnd";

export default function KanbanColumn({ stage, requests }) {
  return (
    <Droppable droppableId={stage}>
      {(provided) => (
        <div
          className="column"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <h3>{stage}</h3>
          {requests.map((r, index) => (
            <Draggable draggableId={r._id} index={index} key={r._id}>
              {(provided) => (
                <div
                  className={`card ${r.isOverdue ? "overdue" : ""}`}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {r.subject}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
