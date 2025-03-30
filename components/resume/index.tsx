import { defaultOrder } from "@lib/constants";
import { ResumeHeader } from "./ResumeHeader";
import { Section } from "./Section";
import { ResumeFooter } from "./ResumeFooter";
import { Exists } from "../Exists";
import defaultStyles from "@styles/resume.module.scss";

type Theme = 'default';

type Props = {
  resume: Resume;
  order?: string[];
  theme?: Theme;
};

const themeStyles: Record<Theme, any> = {
  default: defaultStyles
};

const Resume: FC<Props> = ({ resume, order = defaultOrder, theme = 'default' }) => {
  const keys = Object.keys(resume);
  const result = order.filter((e) => keys.includes(e));
  const styles = themeStyles[theme];

  return (
    <section className={styles["resume-page"]}>
      <Exists exists={keys}>
        <div className={styles.A4}>
          <article className={styles.resume} id="resume">
            <ResumeHeader resume={resume} />
            {result.map((name, i) => {
              return <Section key={i} resume={resume} name={name} />;
            })}
            {/* <Sections resume={resume} order={order} /> */}
            <ResumeFooter resume={resume} />
          </article>
        </div>
      </Exists>
    </section>
  );
};

export default Resume;
