import { v4 as uuidv4 } from "uuid";
import React from "react";
import { Button, Input, Textarea } from "@nextui-org/react";

export default function CardContact() {
  const fnameId = uuidv4();
  const emailId = uuidv4();
  const subjectId = uuidv4();

  return (
    <div className="w-full max-w-xl flex-grow mx-auto md:flex md:items-center md:justify-center">
      <form className="p-4 pb-20 sm:w-1/2 py-10">
        <div className="mb-8">
          <label htmlFor={fnameId} className="label">Your Name</label>
          <Input
            id={fnameId}
            placeholder="First Name"
            type={"text"}
            name="fname"
            className="border border-gray-300 text-xs py-2 w-full"
          />
        </div>
        <div className="mb-8">
          <label htmlFor={emailId} className="label">Your Email</label>
          <Input
            id={emailId}
            placeholder="Your Email"
            type={"email"}
            name="email"
            className="border border-gray-300 text-xs py-2 w-full"
          />
        </div>
        <div className="mb-8">
          <label htmlFor={subjectId} className="label">Subject</label>
          <Input
            id={subjectId}
            placeholder="Subject"
            type={"text"}
            name="subject"
            className="border border-gray-300 text-xs py-2 w-full"
          />
        </div>
        <div className="mb-6">
          <Textarea
            bordered
            color="secondary"
            label="Message"
            labelPlaceholder="Message"
            rows={6}
          />
        </div>
        <Button shadow color="warning" auto>
          Send Message
        </Button>
      </form>
    </div>
  );
}
