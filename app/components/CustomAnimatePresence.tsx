import { AnimatePresence, motion } from "framer-motion";

interface Props {
  open: boolean;
  customKey: string;
  children: React.ReactNode;
}

export function CustomAnimatePresence (props: Props) {
  const { open, customKey, children } = props;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key={customKey}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ type: "tween" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}